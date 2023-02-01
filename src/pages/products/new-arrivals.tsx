import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { GetServerSidePropsContext } from 'next'
import superjson from 'superjson'

import { UserLayout } from '@/components/common/layout/UserLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { BasicProduct } from '@/components/product/BasicProduct'
import { PRODUCTS_NEW_ARRIVAL_LIMIT } from '@/data/constants'
import { createContext } from '@/server/context'
import { appRouter } from '@/server/router/_app'
import { trpc } from '@/utils/trpc'

export default function NewArrivals() {
  const { data, error, isError, isLoading } =
    trpc.product.getAllProduct.useQuery({
      limit: PRODUCTS_NEW_ARRIVAL_LIMIT,
    })
  return (
    <UserLayout>
      <Meta pageTitle="New arrivals" />
      <section aria-labelledby="page-title" className="section pt-24">
        <h2
          id="page-title"
          className="text-2xl font-extrabold capitalize tracking-wider"
        >
          new arrival
        </h2>
        {isLoading ? <Loader /> : null}
        {isError ? <p className="text-red-500">{error.message}</p> : null}
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-1 gap-y-10 gap-x-6 sm:max-w-7xl sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data
            ? data.products.map((product) => (
                <BasicProduct key={product.id} {...product} />
              ))
            : null}
        </div>
      </section>
    </UserLayout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req, res } = ctx

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req, res } as any),
    transformer: superjson,
  })
  await ssg.product.getAllProduct.fetch({
    limit: PRODUCTS_NEW_ARRIVAL_LIMIT,
  })

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}
