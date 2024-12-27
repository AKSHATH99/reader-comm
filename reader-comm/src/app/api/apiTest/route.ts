import dbConnect from "@/lib/dbConnect";

export async function GET(request:Request){
    await dbConnect();
    return Response.json("Server is working fine ")
}