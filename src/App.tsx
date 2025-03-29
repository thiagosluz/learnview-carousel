import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ProfessorList from "./pages/ProfessorList";
import ProfessorForm from "./pages/ProfessorForm";
import ClassList from "./pages/ClassList";
import ClassForm from "./pages/ClassForm";
import NewsList from "./pages/NewsList";
import NewsForm from "./pages/NewsForm";
import LinkList from "./pages/LinkList";
import LinkForm from "./pages/LinkForm";
import NotFound from "./pages/NotFound";
import ScheduleTable from "./pages/ScheduleTable";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/horarios" element={<ScheduleTable />} />
          
          {/* Rotas Protegidas */}
          <Route path="/professors" element={
            <ProtectedRoute>
              <ProfessorList />
            </ProtectedRoute>
          } />
          <Route path="/professors/new" element={
            <ProtectedRoute>
              <ProfessorForm />
            </ProtectedRoute>
          } />
          <Route path="/professors/edit/:id" element={
            <ProtectedRoute>
              <ProfessorForm />
            </ProtectedRoute>
          } />
          
          <Route path="/classes" element={
            <ProtectedRoute>
              <ClassList />
            </ProtectedRoute>
          } />
          <Route path="/classes/new" element={
            <ProtectedRoute>
              <ClassForm />
            </ProtectedRoute>
          } />
          <Route path="/classes/edit/:id" element={
            <ProtectedRoute>
              <ClassForm />
            </ProtectedRoute>
          } />
          
          <Route path="/news" element={
            <ProtectedRoute>
              <NewsList />
            </ProtectedRoute>
          } />
          <Route path="/news/new" element={
            <ProtectedRoute>
              <NewsForm />
            </ProtectedRoute>
          } />
          <Route path="/news/edit/:id" element={
            <ProtectedRoute>
              <NewsForm />
            </ProtectedRoute>
          } />
          
          <Route path="/links" element={
            <ProtectedRoute>
              <LinkList />
            </ProtectedRoute>
          } />
          <Route path="/links/new" element={
            <ProtectedRoute>
              <LinkForm />
            </ProtectedRoute>
          } />
          <Route path="/links/edit/:id" element={
            <ProtectedRoute>
              <LinkForm />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
