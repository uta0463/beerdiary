import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import type { Blog, Tag } from '../../types/article';
import { client } from '../../libs/client';
import Seo from '../components/Utils/Seo';

type Props = {
  posts: Blog;
  tags: Tag[];
  prevEntry: Blog;
  nextEntry: Blog;
};

const generateJsonLd = (posts: Blog) => {
  const name = posts.title;
  const id = posts.id;

  const jsonLd = {
    '@context': 'http://schema.org',
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "name": "HOME",
          "@id": "https://www.beerdiary.jp"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "name": name,
          "@id": "https://www.beerdiary.jp/post/" + id
        }
      }
    ],
  }
  return JSON.stringify(jsonLd)
}

export default function Article({ posts, tags, prevEntry, nextEntry }: Props) {
  const router = useRouter();
  const postDate = new Date(posts.publishedAt);
  const year = postDate.getFullYear();
  const month = postDate.getMonth() + 1;
  const day = postDate.getDate();

  return (
    <>
      <Head>
        <title>{posts.title} | ビールの情報配信【BEER DIARY】</title>
        <meta name="description" content={posts.description} />
        <link rel="canonical" href={'https://www.beerdiary.jp' + router.asPath} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={posts.title} />
        <meta property="og:description" content={posts.description} />
        <meta property="og:url" content={'https://www.beerdiary.jp' + router.asPath} />
        <meta property="og:image" content="https://www.beerdiary.jp/images/ogp.jpg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={posts.title} />
        <meta name="twitter:description" content={posts.description} />
        <meta name="twitter:image" content="https://www.beerdiary.jp/images/ogp.jpg" />
        <Seo
          jsonLd={generateJsonLd(posts)}
        />
      </Head>

      <section className={`p__page__container p__page__container--detail`}>
        <div className={`u__inner`}>

          <div className={`p__page__contents`}>
            <div className={`p__page__head`}>
              <div className={`p__page__date`}>
                <time className="u__date" dateTime={year + '-' + month + '-' + day}>{year + '.' + month + '.' + day}</time>
              </div>
              <h1 className={'p__page__title'}>{posts.title}</h1>
              <div className={`p__page__tag`}>
                <div className={`u__tag`}>
                  <span className={`u__tag__item`}>{posts.category.name}</span>
                </div>
              </div>
            </div>
            <div className={`p__page__body`}>
              <div className={`p__page__main`}>
                <img src={posts.eyecatch.url} alt={posts.title} />
              </div>
              <div className={`p__page__free`}
                dangerouslySetInnerHTML={{
                  __html: `${posts.content}`,
                }}
              />
            </div>
          </div>

          <div className={`p__page__pager`}>
            <div className={`u__pager ${prevEntry.title === undefined ? 'noneprev' : ''}`}>

              {
                prevEntry.title &&
                <div className={`u__pager__tex`}>
                  <Link href={`/post/${prevEntry.id}`} passHref>
                    <a className={`u__pager__link u__pager__link--prev`}><span>{prevEntry.title}</span></a>
                  </Link>
                </div>
              }

              {
                nextEntry.title &&
                <div className={`u__pager__tex`}>
                  <Link href={`/post/${nextEntry.id}`} passHref>
                    <a className={`u__pager__link u__pager__link--next`}><span>{nextEntry.title}</span></a>
                  </Link>
                </div>
              }

            </div>
          </div>

          <div className={`p__page__btn`}>
            <div className={`u__btn`}>
              <Link href="/">
                <a>TOPに戻る</a>
              </Link>
            </div>
          </div>

          <div className={`u__breadcrumb`}>
            <ol>
              <li>
                <Link href={`/`} passHref>
                  <a>Home</a>
                </Link>
              </li>
              <li>{posts.title}</li>
            </ol>
          </div>

        </div>
      </section>

      <section className={`p__page__tags`}>
        <div className={`u__inner`}>
          <div className={`u__inner__contents`}>
            <div className={`p__page__tags__head`}>
              <h2 className={`u__heading`}>カテゴリー</h2>
            </div>
            <div className={`p__page__tags__body`}>
              <ul className={`u__tag__list`}>

                {tags.map(tag => {
                  return (
                    <li key={tag.id}>
                      <Link href={`/category/${tag.id}`} passHref>
                        <a className={`u__tag__item`}>{tag.name}</a>
                      </Link>
                    </li>
                  )
                })}

              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


export const getStaticPaths: GetStaticPaths = async () => {
  const data = await client.get({
    endpoint: 'blogs',
  });
  const paths = data.contents.map((content: any) => `/post/${content.id}`);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id;
  const idExceptArray = id instanceof Array ? id[0] : id;
  const data = await client.get({
    endpoint: 'blogs',
    contentId: idExceptArray,
  });
  let prevFilter;

  const tagData = await client.get({
    endpoint: 'categories',
  });

  const prev = await client.get({
    endpoint: 'blogs',
    queries: {
      limit: 1,
      orders: '-publishedAt',
      filters: `publishedAt[less_than]${data.publishedAt}`
    }
  });

  const next = await client.get({
    endpoint: 'blogs',
    queries: {
      limit: 1,
      orders: 'publishedAt',
      filters: `publishedAt[greater_than]${data.publishedAt}`
    }
  });

  const prevEntry = prev.contents[0] || {};
  const nextEntry = next.contents[0] || {};

  return {
    props: {
      posts: data,
      tags: tagData.contents,
      prevEntry,
      nextEntry
    },
  };
};
