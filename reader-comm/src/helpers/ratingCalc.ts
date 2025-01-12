export function ratingCalculator(newRating: number , noOFReviews: number , totalRating:number) : number[]{

    console.log("in func " , noOFReviews , newRating , totalRating);
    
    const newTotalRating = totalRating + newRating;
    const avgRating = newTotalRating/noOFReviews;
    const newnoOFReviews = noOFReviews+1;

    return [avgRating , newTotalRating , newnoOFReviews];
}