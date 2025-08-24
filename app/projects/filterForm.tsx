'use client';
import { X, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  availableTags: string[];
  selectedTags: string[];
};

const FilterForm = ({ availableTags, selectedTags }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex p-4 right-0 space-y-3 bg-zinc-900   w-full items-start flex-col">
      <h3 className="text-sm font-medium text-zinc-200">Filter by tags</h3>
      {/* Search input */}
      <div className="relative w-full mb-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Golang, Next.js, Automation, Frontend"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 text-sm bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
        />
      </div>

      <form className="w-full">
        <div className="flex flex-col gap-1 max-h-52 overflow-y-auto w-full">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  defaultChecked={selectedTags.includes(tag)}
                  className="checkbox border-zinc-600 checkbox-sm"
                />
                <span className="text-zinc-300 text-sm font-medium">{tag}</span>
              </label>
            ))
          ) : (
            <div className="text-zinc-400 text-sm py-2 px-3">
              No tags found matching "{searchQuery}"
            </div>
          )}
        </div>

        <div className="flex justify-between mt-2">
          <button
            type="submit"
            className="px-3 py-1 text-sm text-white bg-zinc-600 rounded-md hover:bg-zinc-500"
          >
            Apply
          </button>
          {selectedTags.length > 0 && (
            <Link
              href="/projects"
              className="flex items-center px-3 py-1 text-sm text-zinc-300 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default FilterForm;