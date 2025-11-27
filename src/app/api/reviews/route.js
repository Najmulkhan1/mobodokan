import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '../../../lib/dbConnect';

// POST - Submit a new review
export async function POST(request) {
    try {
        const client = await dbConnect();
        const db = client.db('myNextAppDB');

        const reviewData = await request.json();

        // Validate required fields
        if (!reviewData.productId || !reviewData.rating || !reviewData.userName) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields'
            }, { status: 400 });
        }

        const newReview = {
            productId: reviewData.productId,
            rating: parseInt(reviewData.rating),
            comment: reviewData.comment || '',
            userName: reviewData.userName,
            createdAt: new Date(),
        };

        const result = await db.collection('reviews').insertOne(newReview);

        return NextResponse.json({
            success: true,
            data: { ...newReview, _id: result.insertedId }
        }, { status: 201 });
    } catch (error) {
        console.error('API POST Review Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

// GET - Fetch reviews for a product
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({
                success: false,
                error: 'Product ID is required'
            }, { status: 400 });
        }

        const client = await dbConnect();
        const db = client.db('myNextAppDB');

        const reviews = await db.collection('reviews')
            .find({ productId })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ success: true, data: reviews }, { status: 200 });
    } catch (error) {
        console.error('API GET Reviews Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch reviews'
        }, { status: 500 });
    }
}
