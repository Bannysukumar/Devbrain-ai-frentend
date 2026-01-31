import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '@/data/mock'
import { Input } from '@/components/ui'

const categories = ['All', ...Array.from(new Set(blogPosts.map((p) => p.category)))]

export function Blog() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const filtered = blogPosts.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-display text-[var(--text-primary)] mb-2">Blog</h1>
        <p className="text-body text-[var(--text-muted)]">Insights on unified knowledge, AI, and developer experience.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <Input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                category === c ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={`/blog/${post.slug}`} className="block rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden hover:border-[var(--accent-primary)]/50 transition-colors shadow-sm hover:shadow-md">
              <img
                src={post.cover}
                alt=""
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <span className="text-xs font-medium text-[var(--accent-primary)]">{post.category}</span>
                <h2 className="text-h3 text-[var(--text-primary)] mt-2 mb-2">{post.title}</h2>
                <p className="text-small text-[var(--text-muted)] line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-[var(--text-muted)] mt-4">{post.author} · {post.date}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-[var(--text-muted)] py-12">No posts match your filters.</p>
      )}
    </div>
  )
}
