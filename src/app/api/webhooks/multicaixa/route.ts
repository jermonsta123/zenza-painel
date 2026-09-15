import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json({
      received: true,
      reference: payload.reference || 'MCX-DEMO',
      status: 'confirmed',
      processedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Payload JSON inválido' }, { status: 400 });
  }
}
