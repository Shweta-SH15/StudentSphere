
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  country: string;
  image: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mei Lin",
    country: "China",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    quote: "ImmigrantConnect helped me find my first apartment and roommate in Toronto. The process was smooth and I felt secure knowing I had verified options.",
  },
  {
    id: 2,
    name: "Carlos Rodriguez",
    country: "Mexico",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote: "I made my closest friends through this app. The personality matching actually works! Now I have a group to explore the city with.",
  },
  {
    id: 3,
    name: "Aisha Patel",
    country: "India",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    quote: "Finding authentic Indian food in a new country was important to me. This app helped me discover restaurants that remind me of home.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">What Students Say</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Hear from international students who have found their community through ImmigrantConnect
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">from {testimonial.country}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
