import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if(authHeader !== `Bearer ${process.env.CORN_SECRET}`){
        return NextResponse.json({error: "Unauthorize"}, {status: 401})

    }

    try {
        await dbConnect()

        const { connection } = await import ("mongoose")
        await connection.db?.admin().ping()

        const timeStamp = new Date().toISOString();

        return NextResponse.json({
            success: true,
            message: 'mongoDB is alive',
            timeStamp
        })

    } catch(error){
        return NextResponse.json(
            {success: false, error: 'ping failed'},
            {status: 500}
        )
    }
}