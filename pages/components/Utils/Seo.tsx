
type Props = {
  jsonLd?: string
}

const Seo = ({ jsonLd }: Props) => {

  return (
    <>
      {jsonLd && (
        <script
          key="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
    </>
  )
}

export default Seo;