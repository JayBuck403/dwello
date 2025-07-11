import Navbar from "@/components/header";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import Footer from "@/components/Footer";
import { Metadata } from "next";

// Ensure this interface is COMPLETELY REMOVED from this file.
// If it exists anywhere else, consider renaming it if it's not a Next.js-specific type.
// interface PageProps {
//   params: { slug: string };
// }

// Dummy data fetch simulation (no changes needed here)
async function fetchBlogPost(slug: string) {
  const blogPostDetails = {
    id: "1",
    title: "Investing in Accra Real Estate: Trends to Watch in 2025",
    slug: "investing-in-accra-real-estate-2025",
    imageUrl: "/nearby-1.avif",
    date: "2025-04-20",
    author: "Kwame Asare",
    content: `
      <p>Accra's real estate market is dynamic and full of opportunities...</p>
    `,
  };

  const relatedPosts = [
    {
      id: "2",
      title: "Tips for First-Time Home Buyers in Kumasi",
      slug: "first-time-home-buyers-kumasi",
      imageUrl: "/nearby-2.avif",
      date: "2025-04-15",
    },
    {
      id: "3",
      title: "Renting vs. Buying Property in Ghana: Making the Right Choice",
      slug: "renting-vs-buying-property-ghana",
      imageUrl: "/nearby-3.avif",
      date: "2025-04-10",
    },
  ];

  return { blogPostDetails, relatedPosts };
}

// ✅ Define a specific type for generateMetadata's arguments
type GenerateMetadataProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  return {
    title: `Blog – ${params.slug.replace(/-/g, " ")}`,
    description: "Latest updates and trends in Ghana's property market",
  };
}

// ✅ Define a specific type for BlogPostPage's arguments
type BlogPostPageProps = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const { blogPostDetails, relatedPosts } = await fetchBlogPost(slug);

  return (
    <div>
      <Navbar />
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:flex lg:gap-12">
          <div className="lg:w-2/3 max-w-3xl mx-auto lg:mx-0">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">
              {blogPostDetails.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(blogPostDetails.date).toLocaleDateString("en-GH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span>• By {blogPostDetails.author}</span>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md mb-6">
              <Image
                src={blogPostDetails.imageUrl}
                alt={blogPostDetails.title}
                fill
                className="object-cover"
              />
            </div>

            <article
              className="prose prose-lg lg:prose-xl prose-sky text-gray-800 prose-headings:text-primary prose-headings:font-semibold"
              dangerouslySetInnerHTML={{ __html: blogPostDetails.content }}
            />
          </div>

          <aside className="mt-12 lg:mt-0 lg:w-1/3">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Related Posts
            </h3>
            <div className="space-y-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-20 relative rounded overflow-hidden shadow-sm">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <h4 className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString("en-GH", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
}
