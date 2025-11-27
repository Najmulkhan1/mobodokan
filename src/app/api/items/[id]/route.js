import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '../../../../lib/dbConnect';

export async function GET(request, { params }) {
    const { id } = await params;

    try {
        const client = await dbConnect();
        const db = client.db('myNextAppDB');

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: 'Invalid Product ID' }, { status: 400 });
        }

        const product = await db.collection('products').findOne({ _id: new ObjectId(id) });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product }, { status: 200 });
    } catch (error) {
        console.error('API GET Product Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT - Update a product
export async function PUT(request, { params }) {
    const { id } = await params;

    try {
        const client = await dbConnect();
        const db = client.db('myNextAppDB');

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: 'Invalid Product ID' }, { status: 400 });
        }

        const updateData = await request.json();

        // Remove _id from update data if present
        delete updateData._id;

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('API PUT Product Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE - Delete a product
export async function DELETE(request, { params }) {
    const { id } = await params;

    try {
        const client = await dbConnect();
        const db = client.db('myNextAppDB');

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: 'Invalid Product ID' }, { status: 400 });
        }

        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('API DELETE Product Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
