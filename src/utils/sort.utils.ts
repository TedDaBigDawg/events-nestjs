// src/utils/sort.utils.ts

export const sortDate = (items: any[], options?: { date_to_sort?: string }): any[] => {
    const x_options = { date_to_sort: 'start_date', ...options };
  
    return items.sort((itemA, itemB) => 
      Number(new Date(itemA[x_options.date_to_sort])) - Number(new Date(itemB[x_options.date_to_sort]))
    );
  };
  