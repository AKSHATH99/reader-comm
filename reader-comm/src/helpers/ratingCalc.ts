export function ratingCalculator(newRating: number , noOFReviews: number , totalRating:number) : number[]{

    const newTotalRating = totalRating + newRating;
    const avgRating = newTotalRating/noOFReviews

    return [avgRating , newTotalRating];
}