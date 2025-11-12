// import { useQuery } from "@tanstack/react-query";
// // import { categories, getSkills, getStates, subcategories } from "../services/base.service";

// export function useCategoryQuery() {
//   return useQuery({
//     queryKey: ["categories"],
//     queryFn: () => categories(),
//   });
// }
// export function useStateQuery(
//   page:number=1, 
//   size:number=50, 
//   search:string='', 
//   sort:string = 'name', 
//   direction:string='asc'
// ) {
//   return useQuery({
//     queryKey: ["states", page, size, search, sort, direction],
//     queryFn: () => getStates(page,size, search, sort, direction),
//   });
// }
// export function useSkillQuery(
//   page:number=1, 
//   size:number=50, 
//   search:string='', 
//   sort:string = 'name', 
//   direction:string='asc'
// ) {
//   return useQuery({
//     queryKey: ["skills", page, size, search, direction, sort],
//     queryFn: () => getSkills(page,size, search, sort, direction),
//   });
// }

// export function useSubCategoryQuery(categoryId:number){
//     return useQuery(
//         {
//             queryKey: ["subcategories", categoryId],
//             queryFn: () => subcategories(categoryId),
//             enabled: !!categoryId
//         }
//     )
// }