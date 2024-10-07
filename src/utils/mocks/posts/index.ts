export const postMock = {
  id: 1,
  title: 'Example Post Title',
  image: 'example.jpg',
  content: 'This is an example post content.',
  difficulty: 'medium',
  views: 100,
  category: 'develop',
  type: 'posts',
  commentsCount:0,
  favoritesCount:0,
  author: {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
  },
  habs: [
    {
      id: 1,
      name: 'Tech Hab',
      description: 'A community for tech enthusiasts.',
    },
    {
      id: 2,
      name: 'Programming Hab',
      description: 'A community for programmers.',
    }
  ],
  comments: [
    {
      id: 1,
      content: 'Great post!',
      author: {
        id: 2,
        name: 'Jane Doe',
      }
    },
    {
      id: 2,
      content: 'Very informative.',
      author: {
        id: 3,
        name: 'Alice',
      }
    }
  ],
  favorites: [
    {
      id: 1,
      name: 'John Doe',
    },
    {
      id: 3,
      name: 'Alice',
    }
  ],
  userId:1,
};


export const postNewPost = {
  id: 1,
  title: 'title 1',
  image: 'example.jpg',
  content: 'This is an example post content.',
  difficulty: 'medium',
  views: 0,
  category: 'develop',
  type: 'posts',
  commentsCount:0,
  favoritesCount:0,
  author: {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@example.com',
  },
  habs: [
        { id: 2, title: 'Hab 2' }
      ],
  comments: [],
  userId:1,
}

export const mockPosts = [
  {
    id: 1,
    title: 'title 1',
    image: 'develop-article.jpg',
    content: 'This is an article about developing.',
    difficulty: 'medium',
    views: 0,
    category: 'develop',
    type: 'articles',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
    },
    habs: [
      { id: 2, title: 'Hab 2' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 2,
    title: 'title 2',
    image: 'develop-post.jpg',
    content: 'This is a post about developing.',
    difficulty: 'easy',
    views: 0,
    category: 'develop',
    type: 'posts',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 2,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
    },
    habs: [
      { id: 2, title: 'Hab 2' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 3,
    title: 'title 3',
    image: 'develop-news.jpg',
    content: 'Latest news in the developing field.',
    difficulty: 'hard',
    views: 0,
    category: 'develop',
    type: 'news',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 3,
      name: 'Alice Smith',
      email: 'alicesmith@example.com',
    },
    habs: [
      { id: 2, title: 'Hab 2' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 4,
    title: 'title 4',
    image: 'admin-article.jpg',
    content: 'This is an article about administration.',
    difficulty: 'medium',
    views: 0,
    category: 'admin',
    type: 'articles',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 4,
      name: 'Bob Johnson',
      email: 'bobjohnson@example.com',
    },
    habs: [
      { id: 2, title: 'Hab 2' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 5,
    title: 'title 5',
    image: 'admin-post.jpg',
    content: 'This is a post about administration.',
    difficulty: 'easy',
    views: 0,
    category: 'admin',
    type: 'posts',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 5,
      name: 'Charlie Brown',
      email: 'charliebrown@example.com',
    },
    habs: [
      { id: 2, title: 'Hab 2' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 6,
    title: 'title 6',
    image: 'admin-news.jpg',
    content: 'Latest news in the administration field.',
    difficulty: 'hard',
    views: 0,
    category: 'admin',
    type: 'news',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 6,
      name: 'David Lee',
      email: 'davidlee@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 7,
    title: 'title 7',
    image: 'management-article.jpg',
    content: 'This is an article about management.',
    difficulty: 'medium',
    views: 0,
    category: 'management',
    type: 'articles',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 7,
      name: 'Emily Davis',
      email: 'emilydavis@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 8,
    title: 'title 8',
    image: 'management-post.jpg',
    content: 'This is a post about management.',
    difficulty: 'easy',
    views: 0,
    category: 'management',
    type: 'posts',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 8,
      name: 'Frank Moore',
      email: 'frankmoore@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 9,
    title: 'title 9',
    image: 'management-news.jpg',
    content: 'Latest news in the management field.',
    difficulty: 'hard',
    views: 0,
    category: 'management',
    type: 'news',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 9,
      name: 'Grace Wilson',
      email: 'gracewilson@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 10,
    title: 'title 10',
    image: 'marketing-article.jpg',
    content: 'This is an article about marketing.',
    difficulty: 'medium',
    views: 0,
    category: 'marketing',
    type: 'articles',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 10,
      name: 'Henry White',
      email: 'henrywhite@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 11,
    title: 'title 11',
    image: 'marketing-post.jpg',
    content: 'This is a post about marketing.',
    difficulty: 'easy',
    views: 0,
    category: 'marketing',
    type: 'posts',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 11,
      name: 'Ivy Martinez',
      email: 'ivymartinez@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 12,
    title: 'title 12',
    image: 'marketing-news.jpg',
    content: 'Latest news in the marketing field.',
    difficulty: 'hard',
    views: 0,
    category: 'marketing',
    type: 'news',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 12,
      name: 'Jack Thompson',
      email: 'jackthompson@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 13,
    title: 'title 13',
    image: 'popsci-article.jpg',
    content: 'This is an article about popular science.',
    difficulty: 'medium',
    views: 0,
    category: 'popsci',
    type: 'articles',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 13,
      name: 'Kate Baker',
      email: 'katebaker@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 14,
    title: 'title 14',
    image: 'popsci-post.jpg',
    content: 'This is a post about popular science.',
    difficulty: 'easy',
    views: 0,
    category: 'popsci',
    type: 'posts',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 14,
      name: 'Liam Brown',
      email: 'liambrown@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
  {
    id: 15,
    title: 'title 15',
    image: 'popsci-news.jpg',
    content: 'Latest news in the popular science field.',
    difficulty: 'hard',
    views: 0,
    category: 'popsci',
    type: 'news',
    commentsCount: 0,
    favoritesCount: 0,
    author: {
      id: 15,
      name: 'Mia Harris',
      email: 'miaharris@example.com',
    },
    habs: [
      { id: 1, title: 'Hab 1' }
    ],
    comments: [],
    userId: 1,
  },
];
