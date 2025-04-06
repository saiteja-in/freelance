// app/api/user/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const fullUser = await db.user.findUnique({
      where: { email: user.email },
      include: {
        products: true,
        postedJobs: true,
        applications: true,
        bookmarks: true,
        upvotes: true,
        comments: true,
      },
    });

    if (!fullUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(fullUser);
  } catch (error) {
    console.error('[PROFILE_GET_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    console.log('PUT request received');
    const user = await currentUser();
    if (!user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const updated = await db.user.update({
      where: { email: user.email },
      data: {
        name: body.name,
        bio: body.bio,
        location: body.location,
        githubLink: body.githubLink,
        linkedinLink: body.linkedinLink,
        portfolioLink: body.portfolioLink,
        twitterLink: body.twitterLink,
        websiteLink: body.websiteLink,
        resume: body.resume,
        experienceRange: body.experienceRange,
        skills: body.skills,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PROFILE_PUT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
