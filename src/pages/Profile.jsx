import { Edit3, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import BorderTrail from '../components/BorderTrail'
import EmptyState from '../components/EmptyState'
import ProfileCard from '../components/ProfileCard'
import ProductGrid from '../components/ProductGrid'
import { useApp } from '../context/useApp'

export default function Profile() {
  const { user, marketplaceProducts, deleteMarketplaceProduct, transactions, confirmPresencial, recentlyViewed } = useApp()

  if (!user) {
    return (
      <div className="mx-auto max-w-xl">
        <EmptyState title="Inicia sesion para ver tu perfil" text="El login es simulado y solo requiere correo institucional." />
        <div className="mt-4 flex justify-center">
          <Button to="/login">Ingresar</Button>
        </div>
      </div>
    )
  }

  const publications = marketplaceProducts.filter((product) => product.sellerId === user.id || product.sellerName === user.name)
  const history = transactions.filter((transaction) => transaction.buyer === user.name || transaction.seller === user.name)

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <ProfileCard user={user} />
      <div className="space-y-6">
        <section className="glass-panel rounded-lg p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-black">Publicaciones activas</h2>
            <Button to="/marketplace/publish" variant="outline" className="!py-1.5 text-xs">Nueva</Button>
          </div>
          {publications.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {publications.map((product) => {
                const isSold = product.status === 'vendido'
                return (
                  <article key={product.id} className={`group relative overflow-hidden rounded-lg border transition ${isSold ? 'border-slate-700 bg-slate-900/50' : 'border-white/10 bg-[#171a1a] hover:border-[#ff4b00]/25'}`}>
                    {!isSold && <BorderTrail />}
                    <Link to={`/marketplace/product/${product.id}`} className="relative z-0 block h-32 overflow-hidden bg-black">
                      <img className={`h-full w-full object-cover transition duration-500 ${isSold ? 'opacity-40' : 'group-hover:scale-105'}`} src={product.image} alt={product.title} />
                    </Link>
                    <div className="relative z-0 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold">{product.title}</h3>
                        {isSold && <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-400">Vendido</span>}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-black text-[#ff7a3d]">S/ {Number(product.price).toFixed(2)}</p>
                        <div className="flex gap-1">
                          <Link to={`/marketplace/publish?edit=${product.id}`} className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10" title="Editar"><Edit3 size={14} /></Link>
                          <button onClick={() => deleteMarketplaceProduct(product.id)} className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-red-400 hover:bg-red-500/10" title="Eliminar"><Trash2 size={14} /></button>
                          {product.status !== 'vendido' && (
                            <button
                              className="ml-1 rounded bg-[#ff4b00] px-2 py-0.5 text-[11px] font-bold text-white hover:opacity-90 transition-opacity"
                              onClick={() => confirmPresencial(product.id)}
                            >
                              Confirmar presencial
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <EmptyState title="Aun no tienes publicaciones" text="Crea un producto desde Publicar Producto." />
          )}
        </section>

        <section className="glass-panel rounded-lg p-5">
          <h2 className="text-xl font-black">Historial de Compras </h2>
          {history.length ? (
            <div className="mt-4 space-y-3">
              {history.map((transaction) => (
                <article key={transaction.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold">{transaction.productTitle}</h3>
                      <p className="text-sm text-slate-400">Vendedor: {transaction.seller} · Comprador: {transaction.buyer}</p>
                    </div>
                    <span className="rounded-md border border-[#ff4b00]/40 px-2 py-1 text-xs font-bold text-[#ff9b72]">{transaction.status}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">No hay transacciones simuladas todavia.</p>
          )}
        </section>

        {recentlyViewed && recentlyViewed.length > 0 && (
          <section className="glass-panel rounded-lg p-5">
            <h2 className="mb-4 text-xl font-black">Vistos recientemente</h2>
            <ProductGrid products={recentlyViewed} />
          </section>
        )}
      </div>
    </div>
  )
}
