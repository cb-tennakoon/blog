// Import PrismaClient and Role type from Prisma, and faker for generating fake data
import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Main function to seed the database
async function main() {
  console.log('🌱 Starting database seeding...\n');

  // 1. Create roles (e.g., "admin", "author", "user")
  const roles = [
    { name: 'user' },
    { name: 'author' },
    { name: 'admin' },
  ];

  console.log('Creating roles...');
  const createdRoles: Role[] = [];
  for (const roleData of roles) {
    try {
      const role = await prisma.role.upsert({
        where: { name: roleData.name },
        update: { name: roleData.name },
        create: { name: roleData.name },
      });
      createdRoles.push(role);
      console.log(`✓ Created role: ${role.name}`);
    } catch (error) {
      console.error(`❌ Failed to create role '${roleData.name}':`, error);
    }
  }

  // 2. Get role IDs to assign to authors
  const roleIds = createdRoles.map((role) => role.id);

  // 3. Create authors (users who write posts or upload media)
  console.log('\nCreating authors...');
  const authors = Array.from({ length: 10 }).map(() => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    roleId: faker.helpers.arrayElement(roleIds),
    createdAt: faker.date.recent({ days: 365 }),
  }));

  try {
    await prisma.author.createMany({
      data: authors,
      skipDuplicates: true, // Skip if duplicate usernames/emails exist
    });
    console.log(`✓ Created ${authors.length} authors`);
  } catch (error) {
    console.error('❌ Failed to create authors:', error);
    // Don't exit, continue with existing authors
  }

  // 4. Get author IDs to use for media and posts
  const createdAuthors = await prisma.author.findMany();
  
  if (createdAuthors.length === 0) {
    console.error('❌ No authors found in database. Cannot continue seeding.');
    return;
  }

  const authorIds = createdAuthors.map((author) => author.authorId);
  console.log(`Found ${authorIds.length} authors for seeding media and posts`);

  // 5. Create media files (e.g., images, videos, documents)
  console.log('\nCreating media files...');
  const mediaFiles = Array.from({ length: 20 }).map(() => {
    const fileTypes = ['image', 'video', 'document'];
    const fileType = faker.helpers.arrayElement(fileTypes);
    const fileExtension = fileType === 'image' ? 'jpg' : fileType === 'video' ? 'mp4' : 'pdf';
    const fileName = `${faker.system.fileName({ extensionCount: 0 })}.${fileExtension}`;

    return {
      uploadedBy: faker.helpers.arrayElement(authorIds),
      fileName: fileName,
      filePath: `/uploads/${fileName}`,
      fileType: fileType,
      createdAt: faker.date.recent({ days: 180 }),
    };
  });

  try {
    await prisma.media.createMany({
      data: mediaFiles,
    });
    console.log(`✓ Created ${mediaFiles.length} media files`);
  } catch (error) {
    console.error('❌ Failed to create media files:', error);
  }

  // 6. Create posts (blog posts written by authors)
  console.log('\nCreating posts...');
  const posts = Array.from({ length: 15 }).map(() => {
    const title = faker.lorem.sentence({ min: 3, max: 7 });
    const publishedAt = faker.helpers.maybe(() => faker.date.recent({ days: 90 }), { probability: 0.7 });
    
    return {
      authorId: faker.helpers.arrayElement(authorIds),
      title: title,
      slug: faker.helpers.slugify(title).toLowerCase() + '-' + faker.string.alphanumeric(5), // Add random suffix to ensure uniqueness
      content: faker.lorem.paragraphs({ min: 2, max: 5 }),
      status: faker.helpers.arrayElement(['draft', 'published']),
      publishedAt: publishedAt,
      createdAt: faker.date.recent({ days: 365 }),
    };
  });

  try {
    await prisma.post.createMany({
      data: posts,
      skipDuplicates: true, // Skip if duplicate slugs exist
    });
    console.log(`✓ Created ${posts.length} posts`);
  } catch (error) {
    console.error('❌ Failed to create posts:', error);
  }

  // 7. Create token blacklist entries (invalid tokens for security)
  console.log('\nCreating token blacklist entries...');
  const tokens = Array.from({ length: 5 }).map(() => ({
    token: faker.string.uuid(),
    createdAt: faker.date.recent({ days: 30 }),
  }));

  try {
    await prisma.tokenBlacklist.createMany({
      data: tokens,
      skipDuplicates: true, // Skip if duplicate tokens exist
    });
    console.log(`✓ Created ${tokens.length} blacklisted tokens`);
  } catch (error) {
    console.error('❌ Failed to create token blacklist entries:', error);
  }

  console.log('\n🎉 Database seeding completed successfully!');
}

// Run the seed function and handle cleanup
main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });