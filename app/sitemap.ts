import { allProjects } from "@/.contentlayer/generated";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Manually add static pages
  let urls:MetadataRoute.Sitemap = [
    {
      url: "https://jagritnokwal.com",
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: "https://jagritnokwal.com/projects",
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: "https://jagritnokwal.com/contact",
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Get allProjects
  const projectUrls : MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `https://jagritnokwal.com/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  
  urls = urls.concat(projectUrls);
  return urls;
}
