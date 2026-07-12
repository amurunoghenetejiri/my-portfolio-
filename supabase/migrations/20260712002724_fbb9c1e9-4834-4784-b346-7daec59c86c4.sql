
-- media bucket: public read, admin write
CREATE POLICY "media public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
CREATE POLICY "media admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- cv bucket: admin only (public uses signed URLs)
CREATE POLICY "cv admin all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'cv' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'cv' AND public.has_role(auth.uid(), 'admin'));
