import { PackageCheck, ShoppingCart } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
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
  const { storeProducts, addToCart } = useApp()
  const product = storeProducts.find((item) => item.id === id)
  const [selectedSize, setSelectedSize] = useState(product?.availableSizes?.[0] || '')

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
        <Suspense fallback={<div className="grid h-[320px] place-items-center rounded-lg border border-white/10 bg-[#111313] text-sm text-slate-400">Cargando visor 3D...</div>}>
          <Product3DViewer
            modelType={product.modelType}
            modelUrl={product.modelUrl}
            modelScale={product.modelScale}
            modelPosition={product.modelPosition}
            modelRotation={product.modelRotation}
          />
        </Suspense>
      </div>
      <section className="glass-panel rounded-lg p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-[#ff7a3d]">ULIMA STORE · {product.category}</p>
        <h1 className="mt-2 text-4xl font-black">{product.name}</h1>
        <p className="mt-3 text-3xl font-black text-[#ff7a3d]">{formatPrice(product.price)}</p>
        <p className="mt-5 leading-7 text-slate-300">{product.description}</p>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="flex items-center gap-2 text-sm text-slate-300">
            <PackageCheck size={17} className="text-[#ff7a3d]" /> Stock simulado disponible: {product.stock}
          </p>
        </div>
        {product.availableSizes && (
          <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Selecciona tu talla</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {sizeOptions.map((size) => {
                const isAvailable = product.availableSizes.includes(size)
                const isSelected = selectedSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => isAvailable && setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                      isAvailable
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
