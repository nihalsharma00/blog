import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

export function Layout({ children, showSidebar = true, currentPostId }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16" id="main-content">
        {showSidebar ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 xl:gap-14">
              <div className="min-w-0">{children}</div>
              <div className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-6 space-y-6">
                  <Sidebar currentPostId={currentPostId} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      <Footer />
    </div>
  );
}
