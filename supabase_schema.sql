-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'guru', 'siswa')) DEFAULT 'siswa',
  nis TEXT,
  kelas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Reports Table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  incident_date DATE NOT NULL,
  evidence_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'diproses', 'selesai')) DEFAULT 'pending',
  is_anonymous BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 4. Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Admins and Gurus can view all profiles
CREATE POLICY "Admins and Gurus can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'guru')
  )
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- 5. Reports Policies
-- Anyone (authenticated) can create a report
CREATE POLICY "Authenticated users can create reports" 
ON reports FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Siswa can view their own reports
CREATE POLICY "Siswa can view own reports" 
ON reports FOR SELECT 
USING (
  auth.uid() = reporter_id OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'guru')
  )
);

-- Admins and Gurus can update report status
CREATE POLICY "Admins and Gurus can update reports" 
ON reports FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'guru')
  )
);

-- 6. Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- 7. (Optional) Trigger to create profile on signup
-- Note: If you use the manual profile creation in the app, this might conflict.
-- But it's safer to have a fallback.
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'siswa');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/
