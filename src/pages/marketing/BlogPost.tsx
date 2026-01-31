import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogPosts } from '@/data/mock'
import { Button } from '@/components/ui'

export function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-h1 text-[var(--text-primary)] mb-4">Post not found</h1>
        <Link to="/blog"><Button variant="secondary">Back to Blog</Button></Link>
      </div>
    )
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link to="/blog" className="text-small text-[var(--text-muted)] hover:text-[var(--accent-primary)] mb-6 inline-block">
        ← Back to Blog
      </Link>

      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <img src={post.cover} alt="" className="w-full rounded-2xl aspect-video object-cover mb-6 border border-[var(--border)]" />
        <span className="text-xs font-medium text-[var(--accent-primary)]">{post.category}</span>
        <h1 className="text-display text-[var(--text-primary)] mt-2 mb-4">{post.title}</h1>
        <p className="text-body text-[var(--text-muted)] mb-4">{post.excerpt}</p>
        <p className="text-small text-[var(--text-muted)]">{post.author} · {post.date}</p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-invert max-w-none mt-10 text-[var(--text-secondary)]"
      >
        <p>This is a demo blog post. In production you would load full content from a CMS or API.</p>
        <p>DevBrain AI helps teams unify technical knowledge across docs, code, issues, and chats—solving S4 fragmentation with AI-powered search and chat with citations.</p>
      </motion.div>

      <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-wrap gap-4">
        <Button variant="ghost" size="sm">Share</Button>
        <Link to="/blog"><Button variant="secondary" size="sm">More posts</Button></Link>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-h2 text-[var(--text-primary)] mb-4">Related posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="block p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/50 transition-colors">
                <h3 className="font-medium text-[var(--text-primary)]">{p.title}</h3>
                <p className="text-small text-[var(--text-muted)] mt-1">{p.date}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
