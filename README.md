Blog api

- Posts:

  - Create post

    - `POST /posts`
    - body: `{content, title}`

  - Get post info

    - `GET /posts/{id}`

  - Update post

    - `PUT /posts`
    - body `{content, title}`

  - Delete post

    - `DELETE /posts/{id}`

  - Posts list
    - `GET /posts?page=0`

- Comments:

  - Create post

    - `POST /comments`
    - body: `{content, parent, parentType}` (parentType: `Post` | `Comment`)

  - Get post info

    - `GET /comments/{id}`

  - Update post

    - `PUT /comments`
    - body `{content}`

  - Delete post
    - `DELETE /comments/{id}`

- Authorization
  - Type: `Bearer {token}`
    - token - {username}:{password} in base64
  - Sign up:
    - `POST /signup`
    - body `{username, password}`
