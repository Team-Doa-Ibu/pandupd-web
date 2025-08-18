import { useState } from "react";
import { supabase } from "../../data/supabaseClient";

export default function TestDB() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult("Testing connection...");

    try {
      // Test 1: Check if we can connect to Supabase
      const { data, error } = await supabase
        .from("courses")
        .select("count")
        .limit(1);

      if (error) {
        setResult(`Connection error: ${error.message}`);
        return;
      }

      setResult("✅ Database connection successful!");

      // Test 2: Try to insert a test course
      const testCourse = {
        judul: "Test Course " + new Date().toISOString(),
        slug: "test-course-" + Date.now(),
        short_deskripsi: "Test short description",
        deskripsi: "Test full description",
        thumbnail: "",
      };

      const { data: insertData, error: insertError } = await supabase
        .from("courses")
        .insert([testCourse])
        .select()
        .single();

      if (insertError) {
        setResult(
          `✅ Connection OK, but insert failed: ${insertError.message}`,
        );
        return;
      }

      setResult(`✅ SUCCESS! Test course created with ID: ${insertData.id}`);

      // Clean up: delete the test course
      await supabase.from("courses").delete().eq("id", insertData.id);
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Database Connection Test</h1>
      <button
        onClick={testConnection}
        disabled={loading}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Testing..." : "Test Database Connection"}
      </button>
      <div className="mt-4 rounded border p-4">
        <pre className="whitespace-pre-wrap">{result}</pre>
      </div>
    </div>
  );
}
