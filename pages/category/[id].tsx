import { useState } from 'react';
import { useRouter } from "next/router";
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { client } from '../../libs/client';
import type { Blog, Tag } from '../../types/article';
import ReactPaginate from "react-paginate";

type Props = {
  posts: Array<Blog>;
  tags: Tag[];
};


export default function Category({ posts, tags }: Props) {
  const router = useRouter();
  // ページネーション処理
  const [offset, setOffset] = useState(0);
  const perPage = 12;

  const handlePageChange = (data: { selected: number }) => {
    // クリックしたページ数を{selected: 1}のようなオブジェクト形式で引数に受ける
    setOffset(data.selected * perPage)   // 表示する記事の開始位置を変更

    // ページ最上部へスクロールする
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Head>
        <title>{posts[0].category.name} | ビールの情報配信【BEER DIARY】</title>
        <meta name="description" content={posts[0].category.name + `の一覧ページ。` + posts[0].category.name + `に関する情報を配信しております。`} />
        <link rel="canonical" href={'https://xxxx.jp' + router.asPath} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={posts[0].category.name + `| ビールの情報配信【BEER DIARY】`} />
        <meta property="og:description" content={posts[0].category.name + `の一覧ページ。` + posts[0].category.name + `に関する情報を配信しております。`} />
        <meta property="og:url" content={'https://xxxx.jp' + router.asPath} />
        <meta property="og:image" content="https://xxxx.jp/ogp.jpg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={posts[0].category.name + `| ビールの情報配信【BEER DIARY】`} />
        <meta name="twitter:description" content={posts[0].category.name + `の一覧ページ。` + posts[0].category.name + `に関する情報を配信しております。`} />
        <meta name="twitter:image" content="https://xxxx.jp/ogp.jpg" />
      </Head>

      <section className={'p__page__posts'}>
        <div className={`u__inner`}>

          <div className={`c__card__set`}>

            {posts.slice(offset, offset + perPage).map(post => {
              let postDate = new Date(post.updatedAt);
              let year = postDate.getFullYear();
              let month = postDate.getMonth() + 1;
              let day = postDate.getDate();
              return (
                <article key={post.id} className="c__card">
                  <Link href={`/post/${post.id}`} passHref>
                    <a className="c__card__wrap">
                      <div className={`c__card__head`}>
                        <div className={`c__card__img`}>
                          <div className={`c__card__img__item`} style={{ backgroundImage: `url(${post.eyecatch.url})` }}></div>
                        </div>
                      </div>

                      <div className={`c__card__body`}>
                        <div className={`c__card__date`}>
                          <time className="u__date" dateTime={year + '-' + month + '-' + day}>{year + '.' + month + '.' + day}</time>
                        </div>
                        <h2 className={`c__card__title`}>{post.title}</h2>
                        <div className={`c__card__tag`}>
                          <div className={`u__tag`}>
                            <span className={`u__tag__item`}>{post.category.name}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </article>
              )
            })}

          </div>

          <div className={'p__page__posts__btn'}>
            <ReactPaginate
              previousLabel={"<"}  // 前のページボタン
              nextLabel={">"}    // 次のページボタン
              pageCount={Math.ceil(posts.length / perPage)}   // ページ総数
              onPageChange={handlePageChange}   // クリック時のfunction
              containerClassName={"u__pagination"}   // ページネーションであるulに付くクラス名
              activeClassName={"active"}   // アクティブなページのliに着くクラス名
            />
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
};

export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "categories" });
  const paths = data.contents.map((content: any) => `/category/${content.id}`);

  return { paths, fallback: false };
};

export const getStaticProps = async (context: any) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blogs", queries: { filters: `category[equals]${id}` } });

  const tagData = await client.get({
    endpoint: 'categories',
  });

  return {
    props: {
      posts: data.contents,
      tags: tagData.contents,
    },
  };
};