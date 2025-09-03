import Link from "next/link";
import React from "react";
import { allProjects } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card, CardWithBackground } from "../components/card";
import { Article } from "./article";
import { Eye, Filter, X } from "lucide-react";
import FilterForm from "./filterForm";
import { getRedisClient } from "@/lib/redis.serve";
import Redis from "ioredis";



export const revalidate = 60;

interface FiltersProps {
  availableTags: string[];
  selectedTags: string[];
}

const Filters: React.FC<FiltersProps> = ({ availableTags, selectedTags }) => {
  return (
    <div className="relative group z-10 isolate">
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-200 bg-zinc-800 rounded-md hover:bg-zinc-700 w-full lg:w-auto">
        <Filter className="w-4 h-4" />
        Filter
        {selectedTags.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs bg-zinc-600 rounded-full">
            {selectedTags.length}
          </span>
        )}
      </button>

      <div className="absolute left-0 right-auto lg:right-0 lg:left-auto  z-10 hidden pt-2  group-hover:block hover:block w-full lg:w-96">
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
  // Get Redis client
const redis: Redis| null = getRedisClient();

  // Get view counts
  const keys = allProjects.map((p) => ["pageviews", "projects", p.slug].join(":"));

const rawViews = (await redis?.mget(keys))??[]; // returns (string | null)[]

const views = rawViews.reduce((acc, v, i) => {
  acc[allProjects[i].slug] = v ? Number(v) : 0;
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
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="flex flex-col max-w-2xl mx-auto lg:max-w-full lg:flex-row lg:items-center lg:justify-between lg:mx-0">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
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

        <div className="w-full h-px bg-zinc-800" />

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
            <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2">
              {featured && (
                <Card>
                  <Link href={`/projects/${featured.slug}`}>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-zinc-100">
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
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <Eye className="w-4 h-4" />{" "}
                          {Intl.NumberFormat("en-US", {
                            notation: "compact",
                          }).format(views[featured.slug] ?? 0)}
                        </span>
                      </div>

                      <h2
                        id="featured-post"
                        className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                      >
                        {featured.title}
                      </h2>
                      <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                        {featured.description}
                      </p>
                      <div className="absolute bottom-4 md:bottom-8">
                        <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                          Read more <span aria-hidden="true">&rarr;</span>
                        </p>
                      </div>
                    </article>
                  </Link>
                </Card>
              )}

              <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
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

            <div className="hidden w-full h-px md:block bg-zinc-800" />

            <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
              <div className="grid grid-cols-1 gap-4">
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
              <div className="grid grid-cols-1 gap-4">
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
              <div className="grid grid-cols-1 gap-4">
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
