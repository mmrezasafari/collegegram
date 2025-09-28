import { useState } from "react";
import { SearchBar } from "../components/SearchBar";
import TabsBar from "../components/TabBar";
import { UsersGrid } from "../components/UsersGrid";
import PostsGrid from "../components/PostsGrid";

export const SearchPage = () => {
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");

  return (
    <>
      {/* Search Bar */}
      <SearchBar />
      {/* TabsBar */}
      <TabsBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        {activeTab === "users" ? <UsersGrid /> : <PostsGrid />}
      </div>
    </>
  );
};
