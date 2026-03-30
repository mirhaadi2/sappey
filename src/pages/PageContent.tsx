import React from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { usePageBySlug } from '../api/homepage';

const PageContent: React.FC = () => {
  const { slug: pathSlug } = useParams<{ slug: string }>();
  const location = useLocation();

  let slug = pathSlug;
  if (!slug) {
    const path = location.pathname.replace(/^\//, '').toLowerCase();
    if (['about', 'shipping', 'returns', 'faq'].includes(path)) {
      slug = path;
    }
  }

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const { page, isLoading, error } = usePageBySlug(slug);
  if (isLoading) {
    return <div className="p-12 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-12 text-center text-red-600">
        {(error as any)?.message || 'Failed to load page'}
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-12 text-center text-slate-600">Page not found</div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      {page.metaDescription && <p className="text-sm text-slate-500 mb-6">{page.metaDescription}</p>}
      <div className="prose prose-slate" dangerouslySetInnerHTML={{ __html: page.content }} />
    </main>
  );
};

export default PageContent;
