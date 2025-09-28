import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // First, create roles (must be done before creating users)
  const roles = [
    {
      name: 'user',
      permissions: {
        read: ['posts', 'comments', 'media'],
        write: ['comments'],
        edit: ['own_profile'],
        delete: ['own_comments'],
        upload: ['images'],
        admin: false
      },
      description: 'Regular user with basic read and comment permissions',
      isPublic: true,
      isDefault: true,
      level: 1
    },
    {
      name: 'author',
      permissions: {
        read: ['posts', 'comments', 'media', 'drafts', 'analytics'],
        write: ['posts', 'comments', 'drafts'],
        edit: ['own_posts', 'own_profile', 'own_drafts'],
        delete: ['own_posts', 'own_comments', 'own_drafts'],
        upload: ['images', 'videos', 'documents'],
        publish: ['posts'],
        admin: false
      },
      description:
        'Content creator with publishing and media upload permissions',
      isPublic: true,
      isDefault: false,
      level: 2
    },
    {
      name: 'admin',
      permissions: {
        read: ['*'],
        write: ['*'],
        edit: ['*'],
        delete: ['*'],
        upload: ['*'],
        publish: ['*'],
        moderate: ['*'],
        manage_users: true,
        manage_roles: true,
        system_settings: true,
        admin: true
      },
      description: 'System administrator with full access to all features',
      isPublic: false,
      isDefault: false,
      level: 10
    }
  ] as const;

  // Use upsert to handle duplicates gracefully
  const createdRoles: Role[] = [];
  for (const roleData of roles) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const role = await prisma.role.upsert({
        where: { name: roleData.name },
        update: {
          permissions: roleData.permissions,
          description: roleData.description,
          isPublic: roleData.isPublic,
          isDefault: roleData.isDefault,
          level: roleData.level,
        },
        create: {
          name: roleData.name,
          permissions: roleData.permissions,
          description: roleData.description,
          isPublic: roleData.isPublic,
          isDefault: roleData.isDefault,
          level: roleData.level,
        },
      });
      createdRoles.push(role);
      console.log(`✓ Role '${role.name}' processed successfully`);
    } catch (error) {
      console.error(
        `❌ Failed to process role '${roleData.name}':`,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  // Get role IDs for user creation
  const allRoles = await prisma.role.findMany();
  const roleIds: string[] = allRoles.map(role => role.id);
  // Now create users with proper roleId references
  const users = Array.from({ length: 10 }).map(() => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    roleId: faker.helpers.arrayElement(roleIds), // Use roleId instead of role
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
    isActive: faker.datatype.boolean(),
    createdAt: faker.date.recent({ days: 365 }),
    lastLogin: faker.date.recent({ days: 30 }),
  }));

  await prisma.user.createMany({
    data: users,
  });
  console.log(`Created ${users.length} users successfully!`);

  // Get all created users to use their IDs for media
  const createdUsers = await prisma.user.findMany();
  const userIds: number[] = createdUsers.map((user) => user.userId);

  // Create media files
  const mediaFiles = Array.from({ length: 50 }).map(() => {
    const fileTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'audio/mp3',
      'application/pdf',
    ];
    const fileType = faker.helpers.arrayElement(fileTypes);
    const fileExtension = fileType.split('/')[1] || 'jpg';
    const fileName = `${faker.system.fileName({ extensionCount: 0 })}.${fileExtension}`;

    return {
      uploadedBy: faker.helpers.arrayElement(userIds),
      fileName: fileName,
      filePath: `/uploads/${faker.date.recent().getFullYear()}/${faker.date.recent().getMonth() + 1}/${fileName}`,
      fileType: fileType,
      fileSize: faker.number.int({ min: 1024, max: 10485760 }), // 1KB to 10MB
      altText: faker.helpers.maybe(() => faker.lorem.words(3), {
        probability: 0.7,
      }),
      caption: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.6,
      }),
      uploadedAt: faker.date.recent({ days: 180 }),
    };
  });

  await prisma.media.createMany({
    data: mediaFiles,
  });
  console.log(`Created ${mediaFiles.length} media files successfully!`);

  // Create some authors
  const authors = Array.from({ length: 50 }).map(() => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    username: faker.internet.username(),
    passwordHash: faker.internet.password(),
    profileImage: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
    isActive: faker.datatype.boolean(),
  }));

  await prisma.author.createMany({
    data: authors,
  });
  console.log(`Created ${authors.length} authors successfully!`);

  // Create some posts
  const posts = Array.from({ length: 20 }).map(() => {
    const title = faker.lorem.sentence();
    return {
      title: title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      content: faker.lorem.paragraphs(3),
      excerpt: faker.lorem.paragraph(),
      featuredImage: faker.image.url(),
      status: faker.helpers.arrayElement(['draft', 'published', 'scheduled']),
      publishedAt: faker.helpers.maybe(() => faker.date.recent({ days: 90 }), {
        probability: 0.7,
      }),
      viewCount: faker.number.int({ min: 0, max: 1000 }),
      allowComments: faker.datatype.boolean(),
    };
  });

  await prisma.post.createMany({
    data: posts,
  });
  console.log(`Created ${posts.length} posts successfully!`);

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((e: unknown) => {
    prisma.$disconnect();
    console.error(e);
    process.exit(1);
  });