import { useState } from 'react';
import { useRouter } from "next/router";
import { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { client } from '../libs/client';
import type { Blog, Tag } from '../types/article';
import ReactPaginate from "react-paginate";
import styles from '../styles/Home.module.scss';
import Seo from './components/Utils/Seo';

type Props = {
  posts: Array<Blog>;
  tags: Array<Tag>;
};


const generateJsonLd = (posts: Array<Blog>) => {
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
      }
    ],
  }
  return JSON.stringify(jsonLd)
}


export default function Home({ posts, tags }: Props) {
  const router = useRouter();

  // ページネーションする記事数
  const perPage = 12;

  // "開発ブログ"以外のページネーション処理
  const [offset, setOffset] = useState(0);
  const handlePageChange = (data: { selected: number }) => {
    // クリックしたページ数を{selected: 1}のようなオブジェクト形式で引数に受ける
    setOffset(data.selected * perPage)   // 表示する記事の開始位置を変更

    // // ページ最上部へスクロールする
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });
  };

  // "開発ブログ"用のページネーション処理
  const [offsetDev, setOffsetDev] = useState(0);
  const handlePageChangeDev = (data: { selected: number }) => {
    // クリックしたページ数を{selected: 1}のようなオブジェクト形式で引数に受ける
    setOffsetDev(data.selected * perPage)   // 表示する記事の開始位置を変更
  };

  // "ブログ開発"以外のカテゴリーの記事のみフィルタリング
  const filterBeerPosts = posts.filter((output, index) => {
    // console.log(output.category.id)
    return output.category.id != 'dev'
  });
  // console.log(filterBeerPosts)

  // "ブログ開発"カテゴリーの記事のみフィルタリング
  const filterDevPosts = posts.filter((output, index) => {
    // console.log(output.category.id)
    return output.category.id === 'dev'
  });


  return (
    <>
      <Head>
        <title>ビールの情報配信【BEER DIARY】</title>
        <meta name="description" content="【BEER DIARY】ビールに関する情報を配信します。" />
        <link rel="canonical" href="https://www.beerdiary.jp" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ビールの情報配信【BEER DIARY】" />
        <meta property="og:description" content="【BEER DIARY】ビールに関する情報を配信します。" />
        <meta property="og:url" content="https://www.beerdiary.jp" />
        <meta property="og:image" content="https://www.beerdiary.jp/images/ogp.jpg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="ビールの情報配信【BEER DIARY】" />
        <meta name="twitter:description" content="BEER DIARY】ビールに関する情報を配信します。" />
        <meta name="twitter:image" content="https://www.beerdiary.jp/images/ogp.jpg" />
        <Seo
          jsonLd={generateJsonLd(posts)}
        />
      </Head>

      <section className={'p__page__posts'}>
        <div className={`u__inner`}>

          <div className={`c__card__set`}>

            {filterBeerPosts.slice(offset, offset + perPage).map(post => {
              let postDate = new Date(post.publishedAt);
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

          {(() => {
            if (perPage < filterBeerPosts.length) {
              return (
                <div className={'p__page__posts__btn'}>
                  <ReactPaginate
                    previousLabel={"<"}  // 前のページボタン
                    nextLabel={">"}    // 次のページボタン
                    pageCount={Math.ceil(filterBeerPosts.length / perPage)}   // ページ総数
                    onPageChange={handlePageChange}   // クリック時のfunction
                    containerClassName={"u__pagination"}   // ページネーションであるulに付くクラス名
                    activeClassName={"active"}   // アクティブなページのliに着くクラス名
                  />
                </div>
              )
            }
          })()}

        </div>
      </section>

      <section className={'p__page__posts p__page__posts--dev'}>
        <div className={`u__inner`}>

          <div className={`p__page__tags__head`}>
            <h2 className={`u__heading`}>ブログ開発</h2>
          </div>

          <div className={`c__card__set`}>

            {filterDevPosts.slice(offsetDev, offsetDev + perPage).map(post => {
              let postDate = new Date(post.publishedAt);
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

          {(() => {
            if (perPage < filterDevPosts.length) {
              return (
                <div className={'p__page__posts__btn'}>
                  <ReactPaginate
                    previousLabel={"<"}  // 前のページボタン
                    nextLabel={">"}    // 次のページボタン
                    pageCount={Math.ceil(filterDevPosts.length / perPage)}   // ページ総数
                    onPageChange={handlePageChangeDev}   // クリック時のfunction
                    containerClassName={"u__pagination"}   // ページネーションであるulに付くクラス名
                    activeClassName={"active"}   // アクティブなページのliに着くクラス名
                  />
                </div>
              )
            }
          })()}

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

export const getStaticProps: GetStaticProps = async (ctx) => {
  const data = await client.get({ endpoint: 'blogs' });
  const category = await client.get({ endpoint: 'categories' });

  return {
    props: {
      posts: data.contents,
      tags: category.contents,
    },
  };
};
