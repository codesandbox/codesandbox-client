# Let's do a Palindrome.
def palindrome?(string)
	if string.length == 1 || string.length == 0
		true
	else
		if string[0] == string[-1]
			palindrome?(string[1..-2])
		else
			false
		end
	end
end

class Accounts
    def reading_charge
        puts 'instance methods'
    end
    def self.reading_static
        puts 'Class methods'
    end
end

Accounts.reading_static
account = Accounts.new
account.reading_charge

class Array
    def iterator!(&code)
        self.each_with_index do |n, i|
            self[i] = code.call(n)
        end
    end
end                                    

num_array = Array(1..10)

num_array.iterator! { |n| n**2 } 

puts num_array.inspect


def args(&code)
    one, two, three = 1, 2, 3
    code.call(one, two, three)
    puts "Finished the method."
end

block_par = proc { |a,b,c| puts "The first is #{a} and the second is #{b} and the last one is #{c}" }

args(&block_par)
