
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProfessorList from "./pages/ProfessorList";
import ProfessorForm from "./pages/ProfessorForm";
import ClassList from "./pages/ClassList";
import ClassForm from "./pages/ClassForm";
import NewsList from "./pages/NewsList";
import NewsForm from "./pages/NewsForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/professors" element={<ProfessorList />} />
          <Route path="/professors/new" element={<ProfessorForm />} />
          <Route path="/professors/edit/:id" element={<ProfessorForm />} />
          <Route path="/classes" element={<ClassList />} />
          <Route path="/classes/new" element={<ClassForm />} />
          <Route path="/classes/edit/:id" element={<ClassForm />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/new" element={<NewsForm />} />
          <Route path="/news/edit/:id" element={<NewsForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
