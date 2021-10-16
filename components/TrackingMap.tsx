import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { useLayoutEffect, useMemo } from "react";
import Geolocation from "ol/Geolocation";
import { Feature } from "ol";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useSupabaseSession } from "./hooks";
import { toLonLat } from "ol/proj";

const TrackingMap: React.FC = () => {
  const { session, supabase } = useSupabaseSession();
  const map = useMemo(() => new Map({}), []);
  const view = useMemo(() => {
    return new View({
      center: [0, 0],
      zoom: 2,
    });
  }, []);
  const geolocation = useMemo(
    () =>
      new Geolocation({
        // enableHighAccuracy must be set to true to have the heading value.
        trackingOptions: {
          enableHighAccuracy: true,
        },
        projection: view.getProjection(),
      }),
    [view]
  );
  const baseLayer = useMemo(
    () =>
      new TileLayer({
        source: new XYZ({
          url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        }),
      }),
    []
  );
  const positionFeature = useMemo(() => {
    const positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: "#3399CC",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
        }),
      })
    );
    return positionFeature;
  }, []);
  const accuracyFeature = useMemo(() => new Feature(), []);

  const positionVectorLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          features: [positionFeature, accuracyFeature],
        }),
      }),
    [positionFeature, accuracyFeature]
  );

  useLayoutEffect(() => {
    map.setTarget("map");
    map.addLayer(baseLayer);
    map.addLayer(positionVectorLayer);
    map.setView(view);
  }, [map, view, baseLayer, positionVectorLayer]);

  useLayoutEffect(() => {
    const change_geolocation = () => {
      const accuracyGeometry = geolocation.getAccuracyGeometry();
      if (accuracyGeometry) {
        accuracyFeature.setGeometry(accuracyGeometry);
      }

      const coordinates = geolocation.getPosition();
      const lonLat = coordinates ? toLonLat(coordinates) : undefined;
      positionFeature.setGeometry(
        coordinates ? new Point(coordinates) : undefined
      );
      const save = async () => {
        const ins = {
          time: new Date(),
          lon: lonLat?.[0],
          lat: lonLat?.[1],
          accuracy: geolocation.getAccuracy(),
          speed: geolocation.getSpeed(),
          heading: geolocation.getHeading(),
          altitude: geolocation.getAltitude(),
        };
        const { data, error } = await supabase
          .from("point")
          .insert(ins, { returning: "minimal" });
      };
      save();
    };
    const change_center = () => {
      geolocation.setProjection(view.getProjection());
    };
    geolocation.setTracking(true);
    geolocation.on("change", change_geolocation);
    view.on("change:center", change_center);
    return () => {
      geolocation.setTracking(false);
      geolocation.un("change", change_geolocation);
      view.un("change:center", change_center);
    };
  }, [geolocation, accuracyFeature, view, positionFeature]);

  return <div id="map" className="fixed w-full h-full" />;
};

export default TrackingMap;
