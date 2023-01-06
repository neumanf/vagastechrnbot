import CyclicDB from "@cyclic.sh/dynamodb";

import { config } from "../../config";

const db = CyclicDB(config.dbTable);

export class PostsService {
  async getPostUrls(): Promise<string[]> {
    const urls = await db.collection("posts").get("Urls");

    if (!urls) return [];

    return urls.props.urls;
  }

  async updatePostUrls(urls: string[]) {
    return db.collection("posts").set("Urls", {
      urls,
    });
  }

  async deletePostUrls() {
    return db.collection("posts").delete("Urls");
  }
}
