import bcrypt from 'bcrypt';
import supabase from './config/supabaseClient.js';

const seedAdmin = async () => {
  const username = 'admin';
  const password = 'admin123';

  console.log(`🔨 Creating admin user: ${username}`);

  // 1. Hash the password
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  // 2. Check if admin exists
  const { data: existing } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (existing) {
    console.log('⚠️ Admin user already exists. Updating password...');
    const { error } = await supabase
      .from('admins')
      .update({ password_hash })
      .eq('id', existing.id);
      
    if (error) console.error('❌ Error updating admin:', error.message);
    else console.log('✅ Admin password reset to: admin123');
  } else {
    // 3. Insert new admin
    const { error } = await supabase
      .from('admins')
      .insert([{ username, password_hash, role: 'admin' }]);

    if (error) console.error('❌ Error creating admin:', error.message);
    else console.log('✅ Admin created successfully!');
  }
};

seedAdmin();