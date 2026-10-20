"use client";
import { useState } from "react";
import { AccentText } from "./AccentText";
import { levels, type Skills } from "@/lib/content-schema";

export function SkillList({ skills }: { skills: Skills["skills"] }) {
  const [order, setOrder] = useState("asc");
  const [category, setCategory] = useState("すべて");
  const visible = skills
    .filter((skill) => category === "すべて" || skill.category === category)
    .toSorted((a, b) => {
      if (a.level === null && b.level !== null) return 1;
      if (b.level === null && a.level !== null) return -1;
      return (
        ((a.level ?? 0) - (b.level ?? 0)) * (order === "asc" ? 1 : -1) ||
        a.name.localeCompare(b.name)
      );
    });
  return (
    <>
      <div className="my-8 flex flex-wrap items-center justify-between gap-5">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="スキルの種類"
        >
          {["すべて", "言語", "ツール", "フレームワーク"].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setCategory(value)}
              aria-pressed={category === value}
              className={`tag ${category === value ? "tag-selected" : ""}`}
            >
              {value}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          習熟度
          <select
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            className="rounded border border-stone-300 bg-transparent px-3 py-2"
          >
            <option value="asc">低い順</option>
            <option value="desc">高い順</option>
          </select>
        </label>
      </div>
      <ul>
        {visible.map((skill) => (
          <li
            key={`${skill.category}-${skill.name}`}
            className="grid grid-cols-[1fr_auto] gap-3 border-t border-stone-300 py-5 sm:grid-cols-[1fr_130px_140px]"
          >
            <div className="flex items-start gap-4">
              <div className="min-w-0">
                <span>{skill.name}</span>
                {skill.note && (
                  <p className="mt-2 max-w-xl text-sm leading-7 text-stone-500">
                    <AccentText>{skill.note}</AccentText>
                  </p>
                )}
              </div>
            </div>
            <span className="hidden text-sm text-stone-500 sm:block">
              {skill.category}
            </span>
            <span className="text-sm text-stone-600">
              {skill.level === null ? "未設定" : levels[skill.level]}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
