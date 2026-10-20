"use client";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => <p style={{ padding: 40 }}>編集画面を読み込んでいます…</p>,
});
export function EditorLoader() {
  return <Editor />;
}
