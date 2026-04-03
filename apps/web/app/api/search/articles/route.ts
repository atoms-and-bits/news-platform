import { NextResponse } from "next/server";

import { urlFor } from "../../../../lib/sanity/image";
import { getSearchableArticles } from "../../../../lib/sanity/queries";

export async function GET() {
  try {
    const results = await getSearchableArticles();
    const hydratedResults = results.map((article) => ({
      ...article,
      imageUrl: article.mainImage?.asset
        ? urlFor(article.mainImage).width(112).height(112).url()
        : undefined,
    }));

    return NextResponse.json(hydratedResults, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Article search failed", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
