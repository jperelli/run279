// deno run --allow-net --allow-write --location="http://localhost/" --allow-read scripts/mitja2020.ts

import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import { writeCSV } from "https://deno.land/x/csv@v0.6.0/mod.ts";
import { createClient } from "https://deno.land/x/supabase@1.2.0/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.0.0/mod.ts";

const env = config();

const main = async () => {
  const COLS = [
    "Position",
    "Dorsal",
    "Name",
    "Surname",
    "Category",
    "Club",
    "Nationality",
    "Official Time",
    "Real Time",
    "Source",
    "Detail Source",
  ];
  const MAX_PAGES = 1853;
  // const MAX_PAGES = 1;
  const data: any[] = [];
  const decoder = new TextDecoder("iso-8859-1");

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);

  const { data: races } = await supabase.from("race").select("*");

  if (!races) {
    throw new Error("No Race found");
  }

  const race_id = races[0].id;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = `https://edreamsmitjabarcelona.com/resultados/2020/?pagina=${page}`;
    console.log(`Fetching ${url}`);
    const res = await fetch(url);
    const response = await res.arrayBuffer();
    let decoded_string = decoder.decode(response);
    let $ = cheerio.load(decoded_string);
    const page_data_row: any[] = [];
    $(".table-results tbody tr").each((i: number, row: any) => {
      const data_row: string[] = [];
      $(row)
        .find("td")
        .each((j: number, cell: any) => {
          data_row.push($(cell).text().trim());
        });
      data_row.push(url);
      data_row.push(
        `https://edreamsmitjabarcelona.com/ficha/?dr=${data_row[1]}`
      );
      page_data_row.push(data_row);
      data.push(data_row);
    });
    const toInsert = page_data_row.map((d: any) => ({
      position: d[0],
      dorsal: d[1],
      name: d[2] + " " + d[3],
      category: d[4],
      club: d[5],
      country: d[6],
      gun_time: d[7],
      chip_time: d[8],
      source_url: d[10],
      race_id,
    }));
    const { data: insert_data, error: insert_error } = await supabase
      .from("run")
      .insert(toInsert, { returning: "minimal" });
    if (insert_error) {
      console.log(insert_error);
      throw new Error("insert_error");
    }
  }

  const f = await Deno.open("./results.csv", {
    write: true,
    create: true,
    truncate: true,
  });

  data.unshift(COLS);
  await writeCSV(f, data);

  f.close();
};

main().then(() => console.log("Done!"));
