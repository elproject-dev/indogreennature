const fs = require('fs');
const file = 'app/(dashboard)/home/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add states
content = content.replace(
  /const \[articles, setArticles\] = useState<any\[\]>\(\[\]\);/,
  `const [articles, setArticles] = useState<any[]>([]);\n  const [runningTexts, setRunningTexts] = useState<any[]>([]);\n  const [rtConfig, setRtConfig] = useState({ is_enabled: false, speed: 'normal' });`
);

// Update fetch
const fetchReplacement = `          supabase.from("article").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(5),
          supabase.from("running_text").select("*").eq("is_active", true).order("created_at", { ascending: true }),
          supabase.from("running_text_config").select("*").eq("id", 1).single()
        ]);`;
content = content.replace(
  /supabase\.from\("article"\)\.select\("\*"\)\.eq\("is_active", true\)\.order\("created_at", \{ ascending: false \}\)\.limit\(5\)\n        \]\);/,
  fetchReplacement
);

// Update state assignments
const stateAssignment = `        if (articlesRes.data) setArticles(articlesRes.data);
        const runningTextRes = arguments[0][5];
        const configRowRes = arguments[0][6]; // Promise.all array index
        // Actually wait we have to be careful with indexing in Promise.all`;

// A safer way is to just inject independent fetches in the try block
// Let's rethink the inject
