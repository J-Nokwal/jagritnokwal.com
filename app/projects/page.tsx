import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card, CardWithBackground } from "../components/card";
import { Article } from "./article";
import { Redis } from "@upstash/redis";
import { Eye, Filter, X } from "lucide-react";
import FilterForm from "./filterForm";

const redis = Redis.fromEnv();        

export const revalidate = 60;

interface FiltersProps {
  availableTags: string[];
  selectedTags: string[];
}

const Filters: React.FC<FiltersProps> = ({ availableTags, selectedTags }) => {
  return (
    <div className="group z-10 isolate relative">
      <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-md w-full lg:w-auto font-medium text-zinc-200 text-sm">
        <Filter className="w-4 h-4" />
        Filter
        {selectedTags.length > 0 && (
          <span className="flex justify-center items-center bg-zinc-600 rounded-full w-5 h-5 text-xs">
            {selectedTags.length}
          </span>
        )}
      </button>

      <div className="hidden hover:block group-hover:block right-auto lg:right-0 left-0 lg:left-auto z-10 absolute pt-2 w-full lg:w-96">
        <Card>
          <FilterForm availableTags={availableTags} selectedTags={selectedTags} />
        </Card>
      </div>
    </div>
  );
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { tags?: string | string[] };
}) {
  // Get view counts
  const views = (
    await redis.mget<number[]>(
      ...allProjects.map((p) => ["pageviews", "projects", p.slug].join(":"))
    )
  ).reduce((acc, v, i) => {
    acc[allProjects[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  // Process filter tags from search params
  const selectedTags =
    typeof searchParams.tags === "string"
      ? [searchParams.tags]
      : searchParams.tags || [];

  // Filter projects based on selected tags
  const filteredProjects =
    selectedTags.length > 0
      ? allProjects.filter(
          (project) =>
            project.tags &&
            selectedTags.some((tag) => project.tags?.includes(tag))
        )
      : allProjects;

  // Get all unique tags for filter options
  const allTags = Array.from(
    new Set(allProjects.flatMap((project) => project.tags || []))
  ).sort();

  // Featured projects logic (now working with filtered projects)
  const featured = filteredProjects.find(
    (project) => project.slug === "GarageBook"
  );
  const top2 = filteredProjects.find((project) => project.slug === "CarProbe");
  const top3 = filteredProjects.find((project) => project.slug === "GaragePro");

  const sorted = filteredProjects
    .filter(
      (project) =>
        (!featured || project.slug !== featured.slug) &&
        (!top2 || project.slug !== top2.slug) &&
        (!top3 || project.slug !== top3.slug)
    )
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="space-y-8 md:space-y-16 mx-auto px-6 lg:px-8 pt-20 md:pt-24 lg:pt-32 max-w-7xl">
        <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center mx-auto lg:mx-0 lg:max-w-full max-w-2xl">
          <div>
            <h2 className="font-bold text-zinc-100 text-3xl sm:text-4xl tracking-tight">
              Projects
            </h2>
            <p className="mt-4 text-zinc-400">
              Some of the projects are from work and some are on my own time.
            </p>
          </div>

          <div className="mt-4 lg:mt-0 max-w-full">
            <Filters availableTags={allTags} selectedTags={selectedTags} />
          </div>
        </div>

        <div className="bg-zinc-800 w-full h-px" />

        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-400">No projects match your filters.</p>
            <Link
              href="/projects"
              className="mt-2 text-zinc-200 hover:text-white"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="gap-8 grid grid-cols-1 lg:grid-cols-2 mx-auto">
              {featured && (
                <Card>
                  <Link href={`/projects/${featured.slug}`}>
                    <article className="relative p-4 md:p-8 w-full h-full">
                      <div className="flex justify-between items-center gap-2">
                        <div className="text-zinc-100 text-xs">
                          {featured.date ? (
                            <time
                              dateTime={new Date(featured.date).toISOString()}
                            >
                              {Intl.DateTimeFormat(undefined, {
                                dateStyle: "medium",
                              }).format(new Date(featured.date))}
                            </time>
                          ) : (
                            <span>SOON</span>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-zinc-500 text-xs">
                          <Eye className="w-4 h-4" />{" "}
                          {Intl.NumberFormat("en-US", {
                            notation: "compact",
                          }).format(views[featured.slug] ?? 0)}
                        </span>
                      </div>

                      <h2
                        id="featured-post"
                        className="mt-4 font-display font-bold text-zinc-100 group-hover:text-white text-3xl sm:text-4xl"
                      >
                        {featured.title}
                      </h2>
                      <p className="mt-4 text-zinc-400 group-hover:text-zinc-300 leading-8 duration-150">
                        {featured.description}
                      </p>
                      <div className="bottom-4 md:bottom-8 absolute">
                        <p className="hidden lg:block text-zinc-200 hover:text-zinc-50">
                          Read more <span aria-hidden="true">&rarr;</span>
                        </p>
                      </div>
                    </article>
                  </Link>
                </Card>
              )}

              <div className="flex flex-col gap-8 mx-auto lg:mx-0 border-gray-900/10 border-t lg:border-t-0 w-full">
                {[top2, top3].filter(Boolean).map((project) => (
                  <Card key={project?.slug}>
                    <Article
                      project={project!}
                      views={views[project!.slug] ?? 0}
                    />
                  </Card>
                ))}
              </div>
            </div>

            <div className="hidden md:block bg-zinc-800 w-full h-px" />

            <div className="gap-4 grid grid-cols-1 md:grid-cols-3 mx-auto lg:mx-0">
              <div className="gap-4 grid grid-cols-1">
                {sorted
                  .filter((_, i) => i % 3 === 0)
                  .map((project) => (
                    <Card key={project.slug}>
                      <Article
                        project={project}
                        views={views[project.slug] ?? 0}
                      />
                    </Card>
                  ))}
              </div>
              <div className="gap-4 grid grid-cols-1">
                {sorted
                  .filter((_, i) => i % 3 === 1)
                  .map((project) => (
                    <Card key={project.slug}>
                      <Article
                        project={project}
                        views={views[project.slug] ?? 0}
                      />
                    </Card>
                  ))}
              </div>
              <div className="gap-4 grid grid-cols-1">
                {sorted
                  .filter((_, i) => i % 3 === 2)
                  .map((project) => (
                    <Card key={project.slug}>
                      <Article
                        project={project}
                        views={views[project.slug] ?? 0}
                      />
                    </Card>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
