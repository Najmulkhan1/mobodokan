import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';

export async function POST(request) {
    console.log('API Request received');
    try {
        console.log('Connecting to DB...');
        const client = await dbConnect();
        console.log('DB Connected');
        const db = client.db('myNextAppDB');

        // Data sent from the frontend is available in request.json()
        const newItem = await request.json();
        console.log('Payload:', newItem);

        // Insert data into the MongoDB 'products' collection
        const result = await db.collection('products').insertOne(newItem);
        console.log('Insert result:', result);

        return NextResponse.json({ success: true, data: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error('API Error Details:', error);
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 400 });
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const sort = searchParams.get('sort');

        const limit = parseInt(searchParams.get('limit')) || 0;

        const client = await dbConnect();
        const db = client.db('myNextAppDB');

        const query = {};

        if (search) {
            query.productName = { $regex: search, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        let sortOption = { createdAt: -1 }; // Default: Newest

        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        }

        let cursor = db.collection('products').find(query).sort(sortOption);

        if (limit > 0) {
            cursor = cursor.limit(limit);
        }

        const products = await cursor.toArray();

        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
        console.error('API GET Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
    }
}
