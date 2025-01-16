export const pastItems = (items: { start_date: Date }[]): { start_date: Date }[] => {
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    return items.filter(({ start_date }) => new Date(start_date) < yesterday);
  };


export const upcomingItems = (items: { start_date: Date }[]): { start_date: Date }[] => {
    const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24);
    return items.filter(({ start_date }) => new Date(start_date) >= yesterday);
  };