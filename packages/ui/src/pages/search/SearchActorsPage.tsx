import { UserSortBy } from "@local/shared";
import { ActorListItem } from "components";
import { usersQuery } from "graphql/query";
import { User } from "types";
import { SortValueToLabelMap } from "utils";
import { BaseSearchPage } from "./BaseSearchPage";
import { SearchSortBy } from "./types";

const SORT_OPTIONS: SearchSortBy<UserSortBy>[] = Object.values(UserSortBy).map((sortOption) => ({ 
    label: SortValueToLabelMap[sortOption], 
    value: sortOption as UserSortBy 
}));

export const SearchActorsPage = () => {
    const listItemFactory = (node: User, index: number) => (
        <ActorListItem 
            key={`actor-list-item-${index}`} 
            data={node} 
            isStarred={false}
            isOwn={false}
            onClick={() => {}}
            onStarClick={() => {}}
        />)

    return (
        <BaseSearchPage 
            title={'Search Actors'}
            sortOptions={SORT_OPTIONS}
            defaultSortOption={SORT_OPTIONS[1]}
            query={usersQuery}
            listItemFactory={listItemFactory}
        />
    )
}