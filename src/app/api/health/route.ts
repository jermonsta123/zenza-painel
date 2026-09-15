import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    store: 'Zenza Shop Angola',
    timestamp: new Date().toISOString(),
  });
}
