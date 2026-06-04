import { PackageCheck, ShoppingCart } from 'lucide-react'
import { lazy, Suspense, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import FavoriteButton from '../components/FavoriteButton'
import { useApp } from '../context/useApp'
import { formatPrice } from '../utils/format'

const Product3DViewer = lazy(() => import('../components/Product3DViewer'))
const sizeOptions = ['S', 'M', 'L']

export default function StoreDetail() {
  const { id } = useParams()
  const { storeProducts, addToCart, addRecentlyViewed } = useApp()
  const product = storeProducts.find((item) => item.id === id)
  const [selectedSize, setSelectedSize] = useState(product?.availableSizes?.[0] || '')

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product)
    }
  }, [product?.id])

  if (!product) return <EmptyState title="Producto oficial no encontrado" />

  const handleAddToCart = () => {
    addToCart(product, selectedSize)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#171a1a]">
          <img className="h-[420px] w-full object-cover" src={product.image} alt={product.name} />
        </div>
        <Suspense fallback={<div className="grid h-[320px] place-items-center rounded-lg border border-white/10 bg-[#111313]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff4b00] border-t-transparent"></div></div>}>
          {product.modelUrl && (
            <Product3DViewer
              modelType={product.modelType}
              modelUrl={product.modelUrl}
              modelScale={product.modelScale || 1}
            />
          )}
        </Suspense>
      </div>
      <section className="glass-panel h-fit rounded-lg p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#ff9b72]">ULIMA Store</p>
            <h1 className="mt-1 text-3xl font-black">{product.name}</h1>
          </div>
        </div>
        <p className="text-3xl font-black text-[#ff7a3d]">{formatPrice(product.price)}</p>
        <p className="mt-4 text-slate-300">{product.description}</p>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <PackageCheck size={18} className="text-[#10b981]" />
            Stock disponible
          </div>

          <div className="flex items-center gap-3">
            {product.stock > 0 && product.stock <= 12 && (
              <span className="animate-pulse rounded border border-red-500/30 bg-red-500/20 px-2 py-1 text-xs font-bold text-red-400">
                ¡Últimas {product.stock} unidades!
              </span>
            )}
            <span className="font-bold">{product.stock} unidades</span>
          </div>
        </div>

        {product.availableSizes && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Selecciona una talla</p>
            <div className="flex gap-3">
              {sizeOptions.map((size) => {
                const isAvailable = product.availableSizes.includes(size)
                const isSelected = selectedSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => isAvailable && setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${isAvailable
                      ? isSelected
                        ? 'border-[#ff7a3d] bg-[#ff7a3d] text-white'
                        : 'border-white/20 bg-white/5 text-slate-100 hover:border-[#ff7a3d] hover:bg-[#ff7a3d]/10'
                      : 'cursor-not-allowed border-white/10 bg-white/5 text-slate-500'
                      }`}
                    disabled={!isAvailable}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-xs text-slate-500">Tallas disponibles: {product.availableSizes.join(', ')}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleAddToCart} disabled={product.availableSizes && !selectedSize} className="flex-1">
            <ShoppingCart size={18} /> Agregar al carrito
          </Button>
          <FavoriteButton id={product.id} label />
        </div>
      </section>
    </div>
  )
}