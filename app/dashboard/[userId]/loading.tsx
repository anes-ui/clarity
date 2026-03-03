export default function Loading() {
    return (
        <div className="min-h-screen bg-black p-12">
            <div className="max-w-[1600px] mx-auto animate-pulse">
                <div className="h-16 w-1/4 bg-white/5 rounded-lg mb-12"></div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 space-y-8">
                        <div className="h-32 bg-white/5 rounded-xl"></div>
                        <div className="h-64 bg-white/5 rounded-xl"></div>
                    </div>
                    <div className="lg:col-span-8 space-y-8">
                        <div className="h-[400px] bg-white/5 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
