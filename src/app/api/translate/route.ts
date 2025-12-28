import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { TranslateService } from '@/libs/TranslateService';
import { TranslateRequestSchema } from '@/validations/TranslateValidation';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parse = TranslateRequestSchema.safeParse(json);

    if (!parse.success) {
      return NextResponse.json(z.treeifyError(parse.error), { status: 422 });
    }

    const result = await TranslateService.translate(parse.data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 },
    );
  }
}
