interface Todo {
	id: string;
	title: string;
	completed: boolean;
}

type Filter = 'all' | 'completed' | 'active';
